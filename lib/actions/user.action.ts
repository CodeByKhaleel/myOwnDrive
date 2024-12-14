"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
const getUserByEmail = async (email:string) => {
    const {databases} = await createAdminClient()

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email",[email])],
    );

    return result.total > 0 ? result.documents[0] : null
}

const handleError = async(error:unknown,message:string) => {
        console.log(error,message)
        throw error
}
export const sendEmailOtp = async ({email}:{email:string}) => {
    const {account} = await createAdminClient()
    try {
        const session = await account.createEmailToken(ID.unique(),email)
        return session.userId
    } catch (error) {
        handleError(error,"Failed to send email otp")
    }
} 

export const createAccount = async ({
    fullName,email,
}:{
    fullName:string,
    email:string
}) => {

    const existingUser = await getUserByEmail(email)

    const accountId = await sendEmailOtp({email})
    if(!accountId) throw new Error("Failed to send an OTP to your email")

    if(!existingUser){
        const {databases} = await createAdminClient()

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
                accountId     
            },
        );
    } 
    return parseStringify({accountId})   
} 
export const verifySecret = async ({
    accountId, password
    }: {
        accountId: string, 
        password: string
    }) => {
    try {
        const { account } = await createAdminClient();    
        const session = await account.createSession(accountId, password);
        
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        handleError(error, "Failed to verify OTP");
    }
};

export const getCurrentUser = async () => {
    const {account,databases} = await createSessionClient()
    const result = await account.get()
    const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountId",result.$id)],
    )
    if(user.total <= 0) return null
    
    return parseStringify(user.documents[0])
}