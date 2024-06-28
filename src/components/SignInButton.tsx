'use client'

import { FC, useState } from 'react'
import Button from '@/ui/Button'
import { signIn } from 'next-auth/react'
import { toast } from '@/components/ui/toast'

interface SignInButtonProps {

}

const SignInButton: FC<SignInButtonProps> = ({ }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const signInWithGoogle = async () => {
        setIsLoading(true)
        try {
            await signIn('github')
        } catch (e) {
            toast({
                title: 'Error signing in',
                message: 'Please try again later.',
                type: 'error'
            })
        }
    }

    return (
        <Button onClick={signInWithGoogle} isLoading={isLoading}>
            Sign In
        </Button>
    )
}

export default SignInButton