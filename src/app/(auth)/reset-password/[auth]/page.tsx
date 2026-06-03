"use client";

import Image from "next/image";
import { Body } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

const PasswordResetPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica futura para envío de código
  };

  return (
    <div className="min-h-screen w-full  relative">
      <div className="absolute top-15 left-20">
        <Image
          src="/images/logotipo-base.svg"
          alt="Rata Cueva Logo"
          className="w-[120px] sm:w-[150px] md:w-[180px] h-auto"
          width={180}
          height={60}
        />
      </div>

      <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-12 lg:px-20 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="flex justify-center items-center pt-5">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:w-[214px] md:h-[214px] aspect-square"
              aria-label="Restart icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              />
            </svg>
          </div>

          <Body className="text-text text-center w-full max-w-lg px-2.5 sm:px-0">
            Haz clic en el botón para solicitar un código de restablecimiento,
            posteriormente introdúcelo en el formulario de la siguiente interfaz
          </Body>

          <Button type="submit" variant="primary" className="mx-auto">
            Restablecer contraseña
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
