import http, { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { v4 as uuid } from "uuid";

const port: number = 9900;

interface iProps {
  id: string;
  task: string;
  avatar: string;
  started: boolean;
  done: boolean;
}

const server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.writeHead(200);
    let body: string = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk;
    });

    req.on("end", () => {
      let dataPath = path.join(__dirname, "data", "database.json");

      if (req.url === "/api/get" && req.method === "GET") {
        const read = fs.createReadStream(dataPath, { encoding: "utf8" });

        read.on("data", (chunk: Buffer) => {
          res.end(JSON.parse(JSON.stringify(chunk)));
        });
      } else if (req.url === "/api/post" && req.method === "POST") {
        const read = fs.createReadStream(dataPath, { encoding: "utf8" });

        read.on("data", (chunk: Buffer) => {
          const { task, avatar } = JSON.parse(body);
          let data: iProps[] = JSON.parse(chunk.toString());
          let writeableData: iProps = {
            id: uuid(),
            task,
            avatar,
            started: false,
            done: false,
          };
          data.push(writeableData);

          const write = fs.createWriteStream(dataPath);
          write.write(JSON.stringify(data), () => {
            res.end(JSON.stringify(data));
          });
        });
      } else if (req.method === "DELETE") {
        const url: string = req.url?.split("/api/delete/")[1]!;

        const read = fs.createReadStream(dataPath, { encoding: "utf8" });

        read.on("data", (chunk: Buffer) => {
          let data: iProps[] = JSON.parse(chunk.toString());

          const newData = data.filter((el: iProps) => {
            return el.id !== url;
          });

          const write = fs.createWriteStream(dataPath);
          write.write(JSON.stringify(newData), () => {
            res.end(JSON.stringify(newData));
          });
        });
      } else if (req.method === "PATCH") {
        const url: string = req.url?.split("/api/started/")[1]!;

        const read = fs.createReadStream(dataPath, { encoding: "utf8" });

        if (req.url?.split("/api/")[1].split("/")[0] === "started") {
          read.on("data", (chunk: Buffer) => {
            let data: iProps[] = JSON.parse(chunk.toString());

            const newData: iProps = data.find((el: iProps) => {
              return el.id === url;
            })!;

            newData!.started = true;

            const write = fs.createWriteStream(dataPath);
            write.write(JSON.stringify(data), () => {
              res.end(JSON.stringify(data));
            });
          });
        } else if (req.method === "PATCH") {
          const url: string = req.url?.split("/api/done/")[1]!;

          const read = fs.createReadStream(dataPath, { encoding: "utf8" });

          if (req.url?.split("/api/")[1].split("/")[0] === "done") {
            read.on("data", (chunk: Buffer) => {
              let data: iProps[] = JSON.parse(chunk.toString());

              const newData: iProps = data.find((el: iProps) => {
                return el.id === url;
              })!;

              if (newData?.started) {
                newData!.done = true;

                const write = fs.createWriteStream(dataPath);
                write.write(JSON.stringify(data), () => {
                  res.end(JSON.stringify(data));
                });
              } else {
                res.end("start this task first");
              }
            });
          }
        }
      }
    });
  }
);

server.listen(port, () => {
  let dbPath = path.join(__dirname, "data");
  let dataPath = path.join(__dirname, "data", "database.json");

  if (!fs.existsSync(dbPath)) {
    fs.mkdir(dbPath, () => {
      fs.writeFile(dataPath, JSON.stringify([]), () => {
        console.log("connected❤️🚀🚀🚀");
      });
    });
  } else {
    console.log("connected❤️🚀🚀🚀");
  }
});
