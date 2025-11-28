'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    roleId: z.string().min(1, "Role is required"),
    organizationId: z.string().optional(),
})

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true,
                organization: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, users }
    } catch (error) {
        console.error("Failed to fetch users:", error)
        return { success: false, error: "Failed to fetch users" }
    }
}

export async function getRoles() {
    try {
        const roles = await prisma.role.findMany()
        return { success: true, roles }
    } catch (error) {
        return { success: false, error: "Failed to fetch roles" }
    }
}

export async function getOrganizations() {
    try {
        const orgs = await prisma.organization.findMany()
        return { success: true, orgs }
    } catch (error) {
        return { success: false, error: "Failed to fetch organizations" }
    }
}

export async function createUser(prevState: any, formData: FormData) {
    const validatedFields = createUserSchema.safeParse({
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password"),
        roleId: formData.get("roleId"),
        organizationId: formData.get("organizationId"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid input",
        }
    }

    const { name, username, password, roleId, organizationId } = validatedFields.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if (existingUser) {
            return {
                success: false,
                message: "Username already exists"
            }
        }

        const passwordHash = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                username,
                passwordHash,
                roleId,
                organizationId: organizationId || null,
                isActive: true,
            }
        })

        revalidatePath("/dashboard/users")
        return { success: true, message: "User created successfully" }
    } catch (error) {
        console.error("Failed to create user:", error)
        return { success: false, message: "Failed to create user" }
    }
}

const updateUserSchema = z.object({
    id: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().optional(),
    roleId: z.string().min(1, "Role is required"),
    organizationId: z.string().optional(),
})

export async function updateUser(prevState: any, formData: FormData) {
    const validatedFields = updateUserSchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password") || undefined,
        roleId: formData.get("roleId"),
        organizationId: formData.get("organizationId"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid input",
        }
    }

    const { id, name, username, password, roleId, organizationId } = validatedFields.data

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                username,
                NOT: {
                    id
                }
            }
        })

        if (existingUser) {
            return {
                success: false,
                message: "Username already exists"
            }
        }

        const data: any = {
            name,
            username,
            roleId,
            organizationId: organizationId || null,
        }

        if (password && password.length >= 6) {
            data.passwordHash = await bcrypt.hash(password, 10)
        }

        await prisma.user.update({
            where: { id },
            data
        })

        revalidatePath("/dashboard/users")
        return { success: true, message: "User updated successfully" }
    } catch (error) {
        console.error("Failed to update user:", error)
        return { success: false, message: "Failed to update user" }
    }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive }
        })
        revalidatePath("/dashboard/users")
        return { success: true, message: `User ${isActive ? 'activated' : 'deactivated'} successfully` }
    } catch (error) {
        console.error("Failed to toggle user status:", error)
        return { success: false, message: "Failed to toggle user status" }
    }
}
