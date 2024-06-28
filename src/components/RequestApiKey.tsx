'use client'

import { FC, FormEvent, useState } from 'react'
import { toast } from '@/components/ui/toast';
import { createApiKey } from '@/helpers/create-api-key';
import { Key } from 'lucide-react';
import LargeHeading from '@/ui/LargeHeading';
import Paragraph from '@/ui/Paragraph';
import CopyButton from '@/components/CopyButton';
import { Input } from '@/ui/Input';
import Button from '@/ui/Button';

const RequestApiKey: FC = ({ }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string | null>(null);

    const createNewApiKey = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const generatedApiKey = await createApiKey();
            setApiKey(generatedApiKey);
        } catch (err) {
            if (err instanceof Error) {
                toast({
                    type: 'error',
                    title: 'Error',
                    message: err.message
                })
                return
            }
            toast({
                type: 'error',
                title: 'Error',
                message: 'An error occurred while creating a new API key'
            })
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className='container md:max-w-2xl'>
            <div className='flex flex-col gap-6 items-center'>
                <Key className='mx-auto h-12 w-12' />
                <LargeHeading>Request your API Key</LargeHeading>
                <Paragraph>You haven&apos;t requested an API Key yet.</Paragraph>
            </div>

            <form
                onSubmit={createNewApiKey}
                className='mt-6 sm:flex sm:items-center'
                action='#'
            >
                <div className='relative rounded-md shadow-sm sm:min-w-0 sm:flex-1'>
                    {apiKey ? (
                        <CopyButton
                            className='absolute inset-y-0 right-0 animate-in fade-in duration-300'
                            type='button'
                            valueToCopy={apiKey}
                        />
                    ) : null}
                    <Input
                        readOnly
                        value={apiKey ?? ''}
                        placeholder='Replace an API key to display it here!' />
                </div>
                <div className='mt-3 flex justify-center sm:mt-0 sm:ml-4 sm:flex-shrink-0'>
                    <Button disabled={!!apiKey} isLoading={isCreating}>Request key</Button>
                </div>
            </form>
        </div>
    )
}

export default RequestApiKey