import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  User,
  LogIn,
  LogOut,
  Paperclip,
  Image as ImageIcon,
  File,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

export default function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Алексей",
      status: "online",
      avatar: "https://placehold.co/40x40/3b82f6/ffffff?text=А",
    },
    {
      id: 2,
      name: "Мария",
      status: "offline",
      avatar: "https://placehold.co/40x40/10b981/ffffff?text=М",
    },
    {
      id: 3,
      name: "Иван",
      status: "offline",
      avatar: "https://placehold.co/40x40/f59e0b/ffffff?text=И",
    },
    {
      id: 4,
      name: "Екатерина",
      status: "online",
      avatar: "https://placehold.co/40x40/8b5cf6/ffffff?text=Е",
    },
    {
      id: 5,
      name: "Дмитрий",
      status: "offline",
      avatar: "https://placehold.co/40x40/ef4444/ffffff?text=Д",
    },
  ]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Имитация аутентификации
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setUser({
      email,
      name: email.split("@")[0],
      avatar:
        "https://placehold.co/40x40/3b82f6/ffffff?text=" +
        email.charAt(0).toUpperCase(),
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentChat(null);
    setMessages([]);
  };

  const handleContactClick = (contact) => {
    setCurrentChat(contact);
    setMessages([]);

    // Имитация загрузки сообщений
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: "Привет! Как прошел день?",
          sender: "other",
          time: "10:15",
        },
        {
          id: 2,
          text: "Отлично, спасибо! А у тебя?",
          sender: "me",
          time: "10:16",
        },
        {
          id: 3,
          text: "Все хорошо, работаю над проектом",
          sender: "other",
          time: "10:18",
        },
      ]);
    }, 300);

    // Обновление статуса контакта
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, status: "online" } : c))
    );
  };

  const handleSend = () => {
    if (inputMessage.trim() || selectedFile) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage.trim(),
        file: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              url: selectedFile.type.startsWith("image/")
                ? URL.createObjectURL(selectedFile)
                : null,
            }
          : null,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");
      setSelectedFile(null);

      // Имитация ответа
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Сообщение получено",
            sender: "other",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 1000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Эффект для случайного изменения статуса контактов
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setContacts((prev) =>
        prev.map((contact) => {
          if (contact.id !== currentChat?.id) {
            return Math.random() > 0.7
              ? { ...contact, status: "online" }
              : {
                  ...contact,
                  status: Math.random() > 0.5 ? "online" : "offline",
                };
          }
          return contact;
        })
      );
    }, 15000);

    return () => clearInterval(statusInterval);
  }, [currentChat]);

  // Фильтрация контактов по поиску
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Рендер формы входа
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-blue-100 p-3 rounded-full mb-4"
              >
                <MessageCircle className="h-12 w-12 text-blue-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-800">
                Telegram Clone
              </h1>
              <p className="text-gray-500 mt-2">
                Быстрые и безопасные сообщения
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Электронная почта
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
              >
                Войти в аккаунт
              </button>

              <div className="text-center text-sm text-gray-500">
                Нет аккаунта?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Зарегистрироваться
                </a>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Левая панель - Контакты */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
              Чаты
            </h1>
            <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск контактов..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              whileHover={{ backgroundColor: "#f0f7ff" }}
              transition={{ duration: 0.1 }}
              onClick={() => handleContactClick(contact)}
              className={`p-3 flex items-center cursor-pointer ${
                currentChat?.id === contact.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="relative mr-3">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    contact.status === "online" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800 truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2">10:15</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  Привет! Как прошел день?
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">В сети</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Выйти"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Правая панель - Чат */}
      {!currentChat ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-md p-8"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="bg-blue-100 p-4 rounded-full">
                <MessageCircle className="h-12 w-12 text-blue-600" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Telegram Clone
            </h2>
            <p className="text-gray-500 mb-6">
              Выберите чат из списка или начните новый разговор
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Контакты</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Сообщения</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ImageIcon className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Медиа</p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white">
          <div className="border-b border-gray-200 p-4 flex items-center shadow-sm bg-white">
            <div className="relative mr-3">
              <img
                src={currentChat.avatar}
                alt={currentChat.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  currentChat.status === "online"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {currentChat.name}
              </h2>
              <p
                className={`text-sm ${
                  currentChat.status === "online"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {currentChat.status === "online" ? "В сети" : "Не в сети"}
              </p>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ height: "calc(100% - 140px)" }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-700">Нет сообщений</h3>
                <p className="text-sm">Начните разговор с {currentChat.name}</p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-3.5 ${
                      message.sender === "me"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {message.file && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        {message.file.url ? (
                          <img
                            src={message.file.url}
                            alt="Preview"
                            className="max-w-full h-auto rounded-lg"
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-200 rounded">
                            <File className="h-5 w-5 mr-2 text-gray-600" />
                            <span className="text-sm truncate max-w-xs">
                              {message.file.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {message.text && (
                      <p className="break-words">{message.text}</p>
                    )}
                    <span
                      className={`text-xs mt-1 block opacity-80 ${
                        message.sender === "me"
                          ? "text-blue-200"
                          : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-3 overflow-hidden"
              >
                <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                  <File className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm truncate flex-1">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex items-end space-x-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                title="Прикрепить файл"
              >
                <Paperclip className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Напишите сообщение..."
                  className="w-full border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {inputMessage && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setInputMessage("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </motion.button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!inputMessage.trim() && !selectedFile}
                className={`p-2 rounded-full transition-colors ${
                  inputMessage.trim() || selectedFile
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title="Отправить"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="mt-2 flex justify-center text-xs text-gray-400">
              Нажмите Enter для отправки сообщения
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

