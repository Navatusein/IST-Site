"use client"

import {createContext} from "react";
import {ICurrentUser} from "../types/type";

export const CurrentUserContext = createContext<ICurrentUser | null>(null);
