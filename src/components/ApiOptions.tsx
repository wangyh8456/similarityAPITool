'use client';

import { FC, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/DropDownMenu'
import Button from '@/ui/Button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/ui/toast';
import { createApiKey } from '@/helpers/create-api-key';
import { useRouter } from 'next/navigation';
import { revokeApiKey } from '@/helpers/revoke-api-key';

interface ApiOptionsProps {
  apiKeyId: string;
  apiKeyKey: string;
}

const ApiOptions: FC<ApiOptionsProps> = ({ apiKeyId, apiKeyKey }) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isRevoking, setIsRevoking] = useState<boolean>(false);
  const router = useRouter();

  const createNewApiKey = async () => {
    setIsCreating(true);

    try {
      await revokeApiKey({ keyId: apiKeyId });
      await createApiKey();
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error creating new key',
        message: 'Please try again later.',
        type: 'error',
      })
    } finally {
      setIsCreating(false);
    }
  }

  const revokeCurrentApiKey = async () => {
    setIsRevoking(true);
    try {
      await revokeApiKey({ keyId: apiKeyId });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error revoking key',
        message: 'Please try again later.',
        type: 'error',
      })
    } finally {
      setIsRevoking(false);
    }
  }

  return <DropdownMenu>
    <DropdownMenuTrigger disabled={isCreating || isRevoking} asChild>
      <Button variant='ghost' className='flex gap-2 items-center'>
        <p>{isCreating ? 'Creating new key' : isRevoking ? 'Revoking key' : 'Options'}</p>
        {isCreating || isRevoking ? (
          <Loader2 className='animate-spin h-4 w-4'></Loader2>
        ) : null}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => {
        navigator.clipboard.writeText(apiKeyKey);
        toast({
          title: 'Copied',
          message: 'API Key copied to clipboard',
          type: 'success',
        });
      }}>Copy</DropdownMenuItem>
      <DropdownMenuItem onClick={createNewApiKey}>Create new key</DropdownMenuItem>
      <DropdownMenuItem onClick={revokeCurrentApiKey}>Revoke key</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu >
}

export default ApiOptions