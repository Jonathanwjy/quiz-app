import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError("Username dan password tidak boleh kosong.");
      return;
    }

    if (password.length >= 8) {
      setError("Password harus kurang dari 8 karakter.");
      return;
    }

    try {
      // Memanggil API OpenTDB untuk generate token asli
      const response = await fetch(
        "https://opentdb.com/api_token.php?command=request",
      );
      const data = await response.json();

      if (data.response_code === 0) {
        // Simpan token asli dari API (berlaku 6 jam)
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Gagal mendapatkan token dari server.");
      }
    } catch (err) {
      console.log(err);
      setError("Koneksi ke server API gagal.");
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Login Page</h1>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Label>Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="mt-4">
            Login
          </Button>
        </form>
      </div>
    </>
  );
}
