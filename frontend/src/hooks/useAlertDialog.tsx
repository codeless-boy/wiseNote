import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AlertDialogOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export function useAlertDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AlertDialogOptions>({
    title: '',
  })
  const [resolveRef, setResolveRef] = useState<{
    resolve: (value: boolean) => void} | null>(null)

  const showAlert = (title: string, description?: string): Promise<void> => {
    return new Promise((resolve) => {
      setOptions({
        title,
        description,
        confirmText: '确定',
      })
      setResolveRef({ resolve: () => resolve() })
      setIsOpen(true)
    })
  }

  const showConfirm = (
    title: string,
    description?: string,
    confirmText: string = '确定',
    cancelText: string = '取消'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title,
        description,
        confirmText,
        cancelText,
      })
      setResolveRef({ resolve })
      setIsOpen(true)
    })
  }

  const handleConfirm = () => {
    setIsOpen(false)
    if (resolveRef) {
      resolveRef.resolve(true)
      setResolveRef(null)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (resolveRef) {
      resolveRef.resolve(false)
      setResolveRef(null)
    }
  }

  const AlertDialogComponent = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          {options.description && (
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {options.cancelText && (
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleConfirm}>
            {options.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return {
    showAlert,
    showConfirm,
    AlertDialogComponent,
  }
}