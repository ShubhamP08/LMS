import {BsFacebook,BsInstagram,BsLinkedin,BsTwitterX} from 'react-icons/bs'
function Footer(){
    return(
       <>
        <footer className='w-full py-6 flex flex-col sm:flex-row items-center justify-between bg-gray-800 text-white'>
            <div className='container mx-auto text-center'>
                <p>&copy; {new Date().getFullYear()} LMS. All rights reserved.</p>
                <div className='flex justify-center mt-2 space-x-4'>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><BsFacebook size={24}/></a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><BsInstagram size={24}/></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><BsLinkedin size={24}/></a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><BsTwitterX size={24}/></a>
                </div>
            </div>
        </footer>
       </>
    )
}

export default Footer;