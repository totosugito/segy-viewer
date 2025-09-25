import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { LasFileList } from './LasFileList'
import { type LasFileInfo } from '@/service/las-service'

export function LasListPage() {
    const [selectedFile, setSelectedFile] = useState<LasFileInfo | null>(null)

    const handleFileSelect = (file: LasFileInfo) => {
        setSelectedFile(file)
    }

    const handleBackToList = () => {
        setSelectedFile(null)
    }

    return (
        <div className="container mx-auto py-0">
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
                <LasFileList onFileSelect={handleFileSelect} />
            )}
        </div>
    )
}