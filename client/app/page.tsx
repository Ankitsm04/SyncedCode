"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { v4 as uuidV4 } from "uuid";

export default function Home() {

  const router = useRouter();

  const [roomInput, setRoomInput] =
    useState("");

  const [username, setUsername] =
    useState("");

  /*
  LOAD SAVED USERNAME
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
  SAVE USERNAME
  */
  const saveUsername = () => {

    if (!username.trim()) return false;

    localStorage.setItem(
      "sync_username",
      username
    );

    return true;

  };

  /*
  CREATE NEW ROOM
  */
  const createRoom = () => {

    const valid =
      saveUsername();

    if (!valid) return;

    const roomId = uuidV4();

    router.push(
      `/room/${roomId}`
    );

  };

  /*
  JOIN EXISTING ROOM
  */
  const joinRoom = () => {

    if (!roomInput.trim()) return;

    const valid =
      saveUsername();

    if (!valid) return;

    router.push(
      `/room/${roomInput}`
    );

  };

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">

        <h1 className="text-6xl font-extrabold mb-6">
          SyncedCode
        </h1>

        <p className="text-zinc-400 max-w-2xl text-lg mb-10">
          Real-time collaborative coding platform powered by WebSockets.
          Create rooms, code together instantly, and learn how real-time systems work.
        </p>

        {/* USERNAME */}
        <div className="mb-6 w-full max-w-md">

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="w-full bg-zinc-900 border border-zinc-700 px-4 py-4 rounded-xl outline-none"
          />

        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* CREATE */}
          <button
            onClick={createRoom}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Create Room
          </button>

          {/* JOIN */}
          <div className="flex gap-2">

            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomInput}
              onChange={(e) =>
                setRoomInput(
                  e.target.value
                )
              }
              className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-lg outline-none w-72"
            />

            <button
              onClick={joinRoom}
              className="bg-zinc-800 px-5 rounded-lg hover:bg-zinc-700 transition"
            >
              Join
            </button>

          </div>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl">

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <h2 className="text-xl font-bold mb-2">
              Real-Time Sync
            </h2>

            <p className="text-zinc-400">
              Instantly synchronize code between users using WebSockets.
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <h2 className="text-xl font-bold mb-2">
              Collaborative Rooms
            </h2>

            <p className="text-zinc-400">
              Create private coding rooms and share links with others.
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <h2 className="text-xl font-bold mb-2">
              Built With MERN
            </h2>

            <p className="text-zinc-400">
              Learn real-time architecture using Next.js, Node.js, and Socket.IO.
            </p>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-800 py-6 text-center text-zinc-500">

        Made with ❤️ by Ankit Mathapati

      </footer>

    </main>
  );
}