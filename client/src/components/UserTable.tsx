"use client"

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { User } from "@/types"
import { useEffect, useState } from "react"
import DeleteModal from "./DeleteModal"
import UpdateModal from "./UpdateModal"
import { Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { toast } from "sonner"

export default function UserTable() {
    const [users, setUsers] = useState<User[]>()

    const [openUpdate, setOpenUpdate] = useState<User | null | "create">(null)
    const [openDelete, setOpenDelete] = useState<User | null>(null)
    const [requiredAction, setRequiredAction] = useState<"create" | "update">("create")
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`https://the-it-studio-assignment.onrender.com/user`)
                const data = await res.json()
                setUsers(data)
                toast.success("Users fetched successfully")
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch users")
            }
        }
        fetchUsers()
    }, [])

    function closeUpdateModel() {
        setOpenUpdate(null)
    }

    function closeDeleteModel() {
        setOpenDelete(null)
    }



    function createModel() {
        setOpenUpdate("create")
        setRequiredAction("create")
    }

    function updateModal(user: User) {
        setOpenUpdate(user)
        setRequiredAction("update")
    }

    function handleSelect(user: User) {
        setSelectedUsers((prev) => {
            if (prev.includes(user)) {
                return prev.filter((u) => u !== user)
            } else {
                return [...prev, user]
            }
        })
    }

    async function sendUsers() {
        if (selectedUsers.length === 0) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch("https://the-it-studio-assignment.onrender.com/user/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ users: selectedUsers })
            })
            setLoading(false)
            setSelectedUsers([])
            if (res.status === 200) {
                toast.success("Email sent successfully")
            } else {
                toast.error("Failed to send email")
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
            toast.error("Failed to send email")
        }
    }

    if (!users) {
        const array = Array.from({ length: 10 }, (_, i) => i)
        return (
            <div className="grid gap-2" >
                {array.map((key) => (
                    <div key={key}>

                        <Skeleton
                            key={key}
                            className="p-3 rounded-lg h-12 bg-slate-400"

                        />
                    </div>
                ))}
            </div>
        )
    }



    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end gap-10 mr-4 ">
                <Button variant={"secondary"} disabled={selectedUsers.length === 0} onClick={sendUsers}>
                    {loading ? <Loader2 className=" animate-spin" /> : "Send users"}
                </Button>
                <Button onClick={createModel}>Create User</Button>
            </div>
            <div className="border rounded-lg w-full">
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[32px]">
                                    select
                                </TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">Phone</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden lg:table-cell">Hobbies</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, i) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Checkbox id={`select-${user._id}`} onCheckedChange={() => handleSelect(user)} checked={
                                            selectedUsers.includes(user)
                                        } />
                                    </TableCell>
                                    <TableCell className="font-medium">{i + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{user.hobbies.join(", ")}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => updateModal(user)}>
                                                <FilePenIcon className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setOpenDelete(user)}>
                                                <TrashIcon className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <UpdateModal openUpdate={openUpdate} closeUpdateModel={closeUpdateModel} action={requiredAction} setUsers={setUsers} />
                <DeleteModal openDelete={openDelete} closeDeleteModel={closeDeleteModel} setUsers={setUsers} />
            </div>
        </div>
    )
}

function FilePenIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
        </svg>
    )
}


function TrashIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}

