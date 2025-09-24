import React, { useState } from 'react'
import { SegyFileList } from './SegyFileList'
import { type SegyFileInfo } from '@/service/segy-service'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function SegyListPage() {
    const [selectedFile, setSelectedFile] = useState<SegyFileInfo | null>(null)

    const handleFileSelect = (file: SegyFileInfo) => {
        setSelectedFile(file)
    }

    const handleBackToList = () => {
        setSelectedFile(null)
    }

    return (
        <div className="container mx-auto py-6">
            {selectedFile ? (
                <div className="space-y-6">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={handleBackToList}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to File List
                    </Button>
                </div>
            ) : (
                /* File List */
                <SegyFileList onFileSelect={handleFileSelect} />
            )}
        </div>
    )
}