"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { motion } from "framer-motion";

import MonacoEditor from "@monaco-editor/react";

import { socket } from "../../../socket/socket";

import Sidebar from "../../../components/sidebar/Sidebar";

import UsersPanel from "../../../components/users/UsersPanel";

import NotesPanel from "../../../components/notes/NotesPanel";

/*
USER TYPE
*/
type User = {
  socketId: string;
  username: string;
};

/*
ACTIVE EDITOR TYPE
*/
type ActiveEditor = {
  socketId: string;
  username: string;
  line: number;
  column: number;
};

export default function RoomPage() {

  const params = useParams();

  const roomId = params.roomId as string;

  const [code, setCode] =
    useState("// Start coding...");

  const [theme, setTheme] =
    useState("vs-dark");

  const [language, setLanguage] =
    useState("javascript");

  const [notes, setNotes] =
    useState("");

  /*
  FIXED TYPES
  */
  const [users, setUsers] =
    useState<User[]>([]);

  const [activeEditors, setActiveEditors] =
    useState<ActiveEditor[]>([]);

  const [username, setUsername] =
    useState("");

  const [showEditName, setShowEditName] =
    useState(false);

  /*
  LOAD USERNAME
  */
  useEffect(() => {

    const savedName =
      localStorage.getItem(
        "sync_username"
      );

    if (savedName) {

      setUsername(savedName);

    }

  }, []);

  /*
  SOCKET CONNECTION
  */
  useEffect(() => {

    if (!roomId || !username) return;

    socket.emit(
      "join-room",
      {
        roomId,
        username,
      }
    );

    /*
    RECEIVE CODE
    */
    socket.on(
      "receive-code",
      (incomingCode: string) => {

        setCode(incomingCode);

      }
    );

    /*
    RECEIVE NOTES
    */
    socket.on(
      "receive-notes",
      (incomingNotes: string) => {

        setNotes(incomingNotes);

      }
    );

    /*
    RECEIVE USERS
    */
    socket.on(
      "room-users",
      (usersList: User[]) => {

        setUsers(usersList);

      }
    );

    /*
    RECEIVE CURSOR
    */
    socket.on(
      "user-cursor-move",
      (data: ActiveEditor) => {

        setActiveEditors((prev) => {

          const filtered =
            prev.filter(
              (user) =>
                user.socketId !==
                data.socketId
            );

          return [
            ...filtered,
            data,
          ];

        });

      }
    );

    return () => {

      socket.off("receive-code");

      socket.off("receive-notes");

      socket.off("room-users");

      socket.off(
        "user-cursor-move"
      );

    };

  }, [roomId, username]);

  /*
  HANDLE CODE CHANGE
  */
  const handleEditorChange = (
    value: string | undefined
  ) => {

    const updatedCode =
      value || "";

    setCode(updatedCode);

    socket.emit(
      "code-change",
      {
        roomId,
        code: updatedCode,
      }
    );

  };

  /*
  UPDATE USERNAME
  */
  const updateUsername = () => {

    if (!username.trim()) return;

    localStorage.setItem(
      "sync_username",
      username
    );

    socket.emit(
      "update-username",
      {
        roomId,
        username,
      }
    );

    setShowEditName(false);

  };

  return (
    <>

      {/* EDIT NAME MODAL */}
      {showEditName && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">

          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-[400px]">

            <h2 className="text-2xl font-bold mb-3">
              Edit Display Name
            </h2>

            <p className="text-zinc-400 mb-6">
              Update your workspace identity.
            </p>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none mb-5"
            />

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowEditName(false)
                }
                className="flex-1 bg-zinc-800 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateUsername}
                className="flex-1 bg-white text-black py-3 rounded-lg font-semibold"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      <div className="h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white flex overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <div className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-between px-6">

            <div>

              <h1 className="font-bold text-lg">
                SyncedCode
              </h1>

              <p className="text-xs text-zinc-400">
                Room: {roomId}
              </p>

            </div>

            <div className="flex gap-3 items-center">

              {/* PROFILE */}
              <button
                onClick={() =>
                  setShowEditName(true)
                }
                className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                👤 {username}
              </button>

              {/* LANGUAGE */}
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg"
              >

                <option value="javascript">
                  JavaScript
                </option>

                <option value="python">
                  Python
                </option>

                <option value="cpp">
                  C++
                </option>

                <option value="java">
                  Java
                </option>

              </select>

              {/* THEME */}
              <select
                value={theme}
                onChange={(e) =>
                  setTheme(
                    e.target.value
                  )
                }
                className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg"
              >

                <option value="vs-dark">
                  Dark
                </option>

                <option value="light">
                  Light
                </option>

                <option value="hc-black">
                  High Contrast
                </option>

              </select>

            </div>

          </div>

          {/* WORKSPACE */}
          <div className="flex flex-1 overflow-hidden">

            {/* CENTER */}
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="flex-1 flex flex-col"
            >

              {/* EDITOR */}
              <div className="flex-1 overflow-hidden">

                <MonacoEditor
                  height="100%"
                  language={language}
                  theme={theme}
                  value={code}
                  onChange={
                    handleEditorChange
                  }

                  onMount={(editor) => {

                    editor.onDidChangeCursorPosition(
                      (event) => {

                        socket.emit(
                          "cursor-move",
                          {
                            roomId,
                            username,

                            line:
                              event.position.lineNumber,

                            column:
                              event.position.column,
                          }
                        );

                      }
                    );

                  }}

                  options={{
                    fontSize: 16,

                    minimap: {
                      enabled: false,
                    },

                    smoothScrolling: true,

                    automaticLayout: true,
                  }}
                />

              </div>

              {/* NOTES */}
              <div className="h-[40%] overflow-hidden">

                <NotesPanel
                  notes={notes}
                  setNotes={(
                    newNotes: string
                  ) => {

                    setNotes(
                      newNotes
                    );

                    socket.emit(
                      "notes-change",
                      {
                        roomId,
                        notes:
                          newNotes,
                      }
                    );

                  }}
                />

              </div>

            </motion.div>

            {/* USERS */}
            <UsersPanel
              users={users}
              activeEditors={
                activeEditors
              }
              currentUsername={
                username
              }
            />

          </div>

        </div>

      </div>

    </>
  );
}