"use client";
import React, { useState } from "react";
import { AntDesignOutlined } from "@ant-design/icons";

const dataform: React.FC = () => {
  const [filebase64, setFileBase64] = useState<string>("");

  function formSubmit(e: any) {
    e.preventDefault();
    // Submit your form with the filebase64 as
    // one of your fields
    console.log({ filebase64 });
    alert(
      "here you'd submit the form using\n the filebase64 like any other field"
    );
  }

  function convertFile(files: FileList | null) {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      console.log("This file upload is of type:", fileType);
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (ev: any) => {
        // convert it to base64
        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`);
      };
    }
  }

  return (
    <div>
      <div>
        <header className="App-header">
          Choose an image to to upload
          <form onSubmit={formSubmit}>
            <input type="file" onChange={(e) => convertFile(e.target.files)} />
            <hr />
            {filebase64 && (
              <>
                <p>อันนี้มันเป็นรูปที่ต้องการเพิ่มเข้าไปใช่ไหม?</p>

                {/* if it's an image */}
                {/* if it's an image */}
                {/* if it's an image */}
                {filebase64.indexOf("image/") > -1 && (
                  <img src={filebase64} width={300} />
                )}
                {/* if it's an image */}
                {/* if it's an image */}
                {/* if it's an image */}

                {/* if it's a video */}
                {/* if it's a video */}
                {/* if it's a video */}
                {filebase64.indexOf("video/") > -1 && (
                  <video controls>
                    <source src={filebase64} />
                  </video>
                )}
                {/* if it's a video */}
                {/* if it's a video */}
                {/* if it's a video */}

                {/* if it's a audio (music, sound) */}
                {/* if it's a audio (music, sound) */}
                {/* if it's a audio (music, sound) */}
                {filebase64.indexOf("audio/") > -1 && (
                  <audio controls>
                    <source src={filebase64} />
                  </audio>
                )}
                {/* if it's a audio (music, sound) */}
                {/* if it's a audio (music, sound) */}
                {/* if it's a audio (music, sound) */}

                {/* if it's a PDF */}
                {/* if it's a PDF */}
                {/* if it's a PDF */}
                {filebase64.indexOf("application/pdf") > -1 && (
                  <embed src={filebase64} width="800px" height="2100px" />
                )}
                {/* if it's a PDF */}
                {/* if it's a PDF */}
                {/* if it's a PDF */}

                <hr />
                <button> Submit and check the console</button>
              </>
            )}
          </form>
        </header>
      </div>
      <div style={{ margin: "auto", display: "inline" }}>
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
        <img
          src="https://media.tenor.com/VvKVHL5DogYAAAAi/anime-dancing.gif"
          alt="My Image"
        />
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://media.tenor.com/ADP4nszb5AcAAAAi/shigure-ui-dance.gif"
          alt="My Image"
        />
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://media.tenor.com/ADP4nszb5AcAAAAi/shigure-ui-dance.gif"
          alt="My Image"
        />
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://media.tenor.com/N5fU8iyU9F4AAAAi/shigure-ui-dance.gif"
          alt="My Image"
        />
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://media.tenor.com/N5fU8iyU9F4AAAAi/shigure-ui-dance.gif"
          alt="My Image"
        />
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://media.tenor.com/ADP4nszb5AcAAAAi/shigure-ui-dance.gif"
          alt="My Image"
        />
        <img
          style={{ width: "200px", height: "200px" }}
          src="https://media.tenor.com/ADP4nszb5AcAAAAi/shigure-ui-dance.gif"
          alt="My Image"
        />
      </div>
    </div>
  );
};

export default dataform;
