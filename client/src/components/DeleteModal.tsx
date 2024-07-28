"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { User } from "@/types";
import { toast } from "sonner";

type props = {
    openDelete: null | User | undefined,
    closeDeleteModel: () => void
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>
}

export default function DeleteModal({ openDelete, closeDeleteModel, setUsers }: props) {
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
        setDeleting(true)

        try {
            await fetch(`http://localhost:8080/user/${openDelete?._id}`, {
                method: "DELETE"
            })

            setUsers((prev) => prev?.filter((user) => user._id !== openDelete?._id))
            toast.success("User deleted successfully")
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete user")
        }
        finally {
            setDeleting(false)
            closeDeleteModel()
        }
    }

    return (
        <Dialog open={openDelete !== null} onOpenChange={closeDeleteModel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                </DialogHeader>
                <DialogFooter className="gap-3">
                    <Button onClick={() => closeDeleteModel()}>Cancel</Button>
                    <Button
                        variant="destructive"
                        disabled={deleting}
                        onClick={() => handleDelete()}
                    >
                        {
                            deleting ? <Loader2 className="animate-spin" /> : "Delete"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}