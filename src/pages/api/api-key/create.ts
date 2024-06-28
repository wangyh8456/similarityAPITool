import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateApiData } from "@/types/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { withMethods } from "@/lib/api-middlewares/with-methods";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<CreateApiData>
) => {
    try {
        //getServerSession在tsx文件中的调用方式是await getServerSession(authOptions)，API Route中的调用方式是await getServerSession(req, res, authOptions)
        const user = await getServerSession(req, res, authOptions).then(res => res?.user);
        if (!user) {
            res.status(401).json({
                error: "Unauthorized to perform this action",
                createdApiKey: null
            });
            return;
        }

        const existingApiKey = await db.apiKey.findFirst({
            where: {
                userId: user.id,
                enabled: true
            }
        })
        if (existingApiKey) {
            return res.status(400).json({
                error: "An API key already exists for this user",
                createdApiKey: null
            });
        }

        const createdApiKey = await db.apiKey.create({
            data: {
                userId: user.id,
                key: nanoid()
            }
        })
        return res.status(200).json({
            error: null,
            createdApiKey
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: err.issues,
                createdApiKey: null
            });
        }

        return res.status(500).json({
            error: "Internal Server Error",
            createdApiKey: null
        });
    }
}

export default withMethods(["GET"], handler);