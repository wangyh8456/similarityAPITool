'use client'

import { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs'
import Code from '@/components/ui/Code'
import { nodejs, python } from '@/helpers/documentation-code'
import SimpleBar from 'simplebar-react'

const DocumentationTabs: FC = ({ }) => {
    return <Tabs defaultValue='nodejs' className='max-w-2xl w-full'>
        <TabsList>
            <TabsTrigger value='nodejs'>NodeJS</TabsTrigger>
            <TabsTrigger value='python'>Python</TabsTrigger>
        </TabsList>
        <TabsContent value='nodejs'>
            <SimpleBar>
                <Code language='javascript' code={nodejs} show animated />
            </SimpleBar>
        </TabsContent>
        <TabsContent value='python'>
            <SimpleBar>
                <Code language='python' code={python} show animated />
            </SimpleBar>
        </TabsContent>
    </Tabs>
}

export default DocumentationTabs