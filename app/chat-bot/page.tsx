"use client";
import React, { useState } from "react";
import { Input, Button, Avatar, Image, message } from "antd";
import { SendOutlined, EllipsisOutlined } from "@ant-design/icons";
import axios from "axios";
import logo from "../../public/images/logo.png"; // Adjust the path as necessary

const { TextArea } = Input;

interface MessageType {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const TemplateChatBot: React.FC = (): React.ReactElement => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage: MessageType = {
        id: Date.now().toString(),
        content: inputValue,
        isBot: false,
        timestamp: new Date(),
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue("");
      setLoading(true);

      try {
        const response = await axios.post(
          "http://44.241.121.20:7000/api/chat/25638ebf-f5f0-444b-9aa9-2248f93a9a29",
          { message: currentInput },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Full response:", response);
        console.log("Response data:", response.data);

        // Check if response is successful
        if (response.status === 200 && response.data) {
          const botMessage: MessageType = {
            id: (Date.now() + 1).toString(),
            content: response.data.response || response.data.message || response.data || "No response",
            isBot: true,
            timestamp: new Date(),
          };
          console.log("Bot message:", botMessage);
          setMessages((prev) => [...prev, botMessage]);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, there was an error processing your message. Please try again.",
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        message.error("Failed to send message");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-start bg-white border-b border-gray-200 pl-2 pr-4 py-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-20  flex items-center justify-center">
              <Image src={logo.src} />
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="grid col-span-1">
              <div className="font-bold ">OSD COMPANY</div>
              <div className="text-sm text-gray-400">Document AI Assistant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <EllipsisOutlined className="text-gray-400 text-xl" />
                  </div>
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">Welcome to your chatbot!</h2>
                <p className="text-gray-500 text-sm">Ask me anything about the documents I've been trained on.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                  <div className={`flex items-start space-x-2 max-w-2xl ${msg.isBot ? "" : "flex-row-reverse space-x-reverse"}`}>
                    <Avatar className={`${msg.isBot ? "bg-orange-400" : "bg-blue-500"} flex-shrink-0`} size="small">
                      {msg.isBot ? "AI" : "U"}
                    </Avatar>
                    <div className={`px-4 py-2 rounded-lg ${msg.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white"}`}>{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-2xl">
                    <Avatar className="bg-orange-400 flex-shrink-0" size="small">
                      AIYARA
                    </Avatar>
                    <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 6 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="resize-none border-gray-300 rounded-lg"
                disabled={loading}
              />
            </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              loading={loading}
              className="h-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateChatBot;
