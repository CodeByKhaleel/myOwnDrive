import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import FileUploder from './FileUploder'
import Search from './Search'
const Header = () => {
  return (
    <header className='header'>
        <Search />
        <div className='heaer-wrapper'>
            <FileUploder />
            <form>
                <Button type="submit" className='sign-out-button'>
                    <Image 
                    src="/assets/icons/logout.svg"
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-6"
                    />
                </Button>
            </form>
        </div>
    </header>
  )
}

export default Header
