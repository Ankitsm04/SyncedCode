"use client";

export default function UsersPanel({
  users,
  activeEditors,
  currentUsername,
}) {

  return (
    <div className="w-72 bg-white/5 backdrop-blur-lg border-l border-white/10 p-4 overflow-auto">

      <h2 className="text-xl font-bold mb-2">
        Online Users
      </h2>

      <p className="text-zinc-400 text-sm mb-5">
        {users.length} active users
      </p>

      <div className="space-y-3">

        {users.map((user) => {

          /*
          FIND ACTIVE REMOTE USER
          */
          const active =
            activeEditors.find(
              (editor) =>
                editor.socketId ===
                user.socketId
            );

          /*
          IS CURRENT USER
          */
          const isMe =
            user.username ===
            currentUsername;

          return (

            <div
              key={user.socketId}
              className="bg-white/5 p-3 rounded-xl"
            >

              <div className="flex items-center gap-3 mb-1">

                <div className="w-3 h-3 rounded-full bg-green-400" />

                <span className="text-sm font-medium">

                  {user.username}

                  {isMe && (
                    <span className="text-zinc-500">
                      {" "} (You)
                    </span>
                  )}

                </span>

              </div>

              {/* ONLY SHOW FOR OTHER USERS */}
              {!isMe && active && (

                <p className="text-xs text-zinc-400 ml-6">

                  Editing line {active.line},
                  column {active.column}

                </p>

              )}

            </div>

          );

        })}

      </div>

    </div>
  );
}