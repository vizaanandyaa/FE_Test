// app/login/page.tsx
"use client";

import { useState } from "react";
import { TextInput, PasswordInput, Button, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import Image from "next/image";
import jm from '../../assets/jm.png'
import jm2 from '../../assets/jm2.jpeg'

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // TODO: ganti dengan endpoint login aslimu
      const res = await fetch("https://api.example.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Username atau password salah");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* KIRI: Logo + Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-md">
          {/* App Logo box (sesuai wireframe) */}
          
            {/* kalau sudah punya file logo, ganti div ini dengan <Image /> */}
           <Image src={jm} alt="logo" style={{width:'300px', margin: '0 auto'}}/>
          

          {/* Form Login */}
          <div className="space-y-4">
            <div>
              <TextInput
                label="Username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div>
              <PasswordInput
                label="Password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            <div className="pt-4">
              <Button
                fullWidth
                radius="md"
                loading={loading}
                onClick={handleLogin}
                className="bg-slate-800 hover:bg-slate-900"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: App Illustration / Background */}
      <div className="hidden md:block md:w-1/2 bg-slate-100 relative">
        {/* Pakai gambar sendiri di /public, misal /login-illustration.png */}
        <Image
          src={jm2} // ganti dengan file ilustrasimu
          alt="App Illustration / Background"
          fill
          className="object-cover"
        />
        {/* overlay tipis supaya teks (kalau ada) masih kebaca */}
        <div className="absolute inset-0 bg-slate-900/5" />
        {/* Optional: teks tengah kalau belum punya gambar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-slate-500 text-xl font-semibold">
            App Illustration / Background
          </span>
        </div>
      </div>
    </div>
  );
}
