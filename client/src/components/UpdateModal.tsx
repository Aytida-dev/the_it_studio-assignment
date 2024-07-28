"use client"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { User } from "@/types";
import UserForm from "./UserForm";

type props = {
    openUpdate: null | User | "create",
    closeUpdateModel: () => void
    action: "create" | "update"
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>
}

export default function UpdateModal({ openUpdate, closeUpdateModel, action, setUsers }: props) {

    return (
        <Dialog open={openUpdate !== null} onOpenChange={closeUpdateModel}>
            <DialogContent>
                <DialogTitle> User Form</DialogTitle>
                <DialogDescription>
                    Enter the user details here
                </DialogDescription>
                <UserForm data={openUpdate} closeModel={closeUpdateModel} action={action} setUsers={setUsers} />
            </DialogContent>
        </Dialog>
    )
}