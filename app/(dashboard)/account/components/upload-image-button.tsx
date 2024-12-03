"use client";

import Image from "next/image";
import { toast } from "sonner";
import { ChangeEvent, useState, useTransition } from "react";
import { ImageUp, Loader, LucideIcon, Trash2, X } from "lucide-react";
import { deleteImage, updateProfileImage } from "@/actions/uploadthing";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteProfileImage, updateUserImage } from "@/actions/profile-user";

interface UploadImageButtonProps {
  userImage: string | null;
}

export default function UploadImageButton({
  userImage,
}: UploadImageButtonProps) {
  const [deleting, startDeletingTransition] = useTransition();
  const [uploading, startUploadingTransition] = useTransition();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // Tamaño máximo de la imagen 4MB
      if (file.size > maxSizeInBytes) {
        setImageSrc(null);
        toast.error(
          "La imagen seleccionada excede el tamaño máximo permitido de 4MB."
        );
        return;
      }

      setFile(file);

      const src = URL.createObjectURL(file);
      setImageSrc(src);
    }
  };

  const handleUploadImage = () => {
    startUploadingTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("image", file!);

        const response = await updateProfileImage(formData);

        if (response?.success && response.imageUrl) {
          const result = await updateUserImage(response.imageUrl);
          toast.success(result.success);
          setImageSrc(null);
          setFile(null);
        }

        if (!response?.success) {
          toast.error("No se pudo subir la imagen.");
        }
      } catch (error) {
        toast.error("Algo salió mal al subir la imagen");
      }
    });
  };

  const handleImageDelete = () => {
    startDeletingTransition(async () => {
      try {
        const success = await deleteImage(userImage!);

        if (!success) {
          toast.error("Error al eliminar la imagen");
        }

        if (success) {
          const response = await deleteProfileImage();

          if (response.error) {
            toast.error("Error el eliminar la imagen de perfil");
          }

          if (response.success) {
            toast.success(response.success);
          }
        }
      } catch (error) {
        toast.error("Algo salió mal al subir la imagen.");
      }
    });
  };

  return (
    <div className="text-center space-y-3 bg-accent-foreground/5 dark:bg-accent p-6 rounded-lg">
      <div className="w-[140px] h-[140px] mx-auto rounded-full border mb-3">
        <label
          htmlFor="fileInput"
          className="relative flex items-center justify-center size-full rounded-full cursor-pointer"
        >
          <div
            className={cn(
              "flex items-center justify-center z-50 inset-0 rounded-full bg-zinc-600/60 absolute",
              imageSrc && "hidden"
            )}
          >
            <ImageUp className="text-white size-2/5" />
          </div>
          <input
            id="fileInput"
            name="file"
            type="file"
            accept="image/*"
            onChange={handleChange}
            hidden
            disabled={deleting || uploading}
          />
          {userImage && !imageSrc && (
            <Image
              src={userImage}
              alt="image file selected"
              width={180}
              height={180}
              className="object-cover size-full rounded-full"
            />
          )}
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="image file selected"
              width={180}
              height={180}
              className="object-cover size-full rounded-full"
            />
          )}
        </label>
      </div>
      <ReusableButton
        label="Eliminar foto"
        loadingLabel="Eliminando"
        handleClick={handleImageDelete}
        disabled={deleting}
        IconInOff={Trash2}
        className={cn(
          "text-rose-500 dark:text-rose-500 bg-rose-600/20 hover:bg-rose-600/30 dark:hover:bg-rose-600/40",
          !userImage && "hidden",
          imageSrc && "hidden"
        )}
      />

      <div
        className={cn(
          "flex items-center justify-center gap-3",
          !imageSrc && "hidden"
        )}
      >
        <ReusableButton
          label="Cancelar"
          handleClick={() => {
            setImageSrc(null);
            setFile(null);
          }}
          oneState
          disabled={deleting}
          IconInOff={X}
          className={cn(
            "text-rose-500 dark:text-rose-400 bg-rose-600/20 hover:bg-rose-600/30 dark:hover:bg-rose-600/40 rounded-full my-2",
            !imageSrc && "hidden",
            uploading && "hidden"
          )}
        />

        <ReusableButton
          label="Aceptar"
          loadingLabel="Cambiando"
          handleClick={handleUploadImage}
          disabled={uploading}
          IconInOff={ImageUp}
          className={cn(
            "text-indigo-500 dark:text-indigo-400 bg-indigo-600/20 hover:bg-indigo-600/30 dark:hover:bg-indigo-600/40 rounded-full my-2",
            !imageSrc && "hidden"
          )}
        />
      </div>
    </div>
  );
}

interface ReusableButtonProps {
  label: string;
  loadingLabel?: string;
  disabled?: boolean;
  oneState?: boolean;
  IconInOff: LucideIcon;
  className: string;
  handleClick: () => void;
}

function ReusableButton({
  label,
  loadingLabel,
  disabled,
  oneState = false,
  IconInOff,
  className,
  handleClick,
}: ReusableButtonProps) {
  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn("rounded-full my-2", className)}
    >
      {!disabled && (
        <>
          <IconInOff className="size-4 mr-2 shrink-0" />
          {label}
        </>
      )}
      {disabled && !oneState && (
        <>
          <Loader className="animate-spin" />
          {loadingLabel}
        </>
      )}
    </Button>
  );
}
