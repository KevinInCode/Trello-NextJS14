"use server";

import {InputType, ReturnType} from "./types";

import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

import {createSafeAction} from "@/lib/create-safe-action";
import {CreateBoardSchema} from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {userId} = auth();

  if(!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const {title} = data;

  let board;

  try {
    board = await db.board.create({
      data: {
        title
      }
    })
  }catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/board/${board.id}`);
  return {
    data: board
  }
}

export const createBoard = createSafeAction(CreateBoardSchema, handler);