"use client"
import DialogBox from '@/components/DialogBox'
import React, { createContext, useContext, useState } from 'react'

const DialogContext = createContext()

export default function DialogBoxProvider({children}) {
    const [dialogProp, setDialogProp] = useState({
        isOpen: false,
        message: ''
    })

    const openDialog = (message) => {
        setDialogProp({
            isOpen: true,
            message: message
        })
    } 

    const onClose = () => {
        setDialogProp({
            isOpen: false,
            message: ''
        })}


  return (
    <DialogContext.Provider value={{ dialogProp, onClose, openDialog }}>
        {children}
        <DialogBox isOpen={dialogProp.isOpen} message={dialogProp.message} onClose={onClose} />
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)