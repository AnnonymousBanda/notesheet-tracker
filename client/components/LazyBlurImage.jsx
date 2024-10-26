"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LazyBlurImage = ({
  src,
  alt,
  width,
  height,
  rounded = true,
  bgColor = true,
  className = "",
}) => {
  return (
    <div
      style={{
        width: `${width / 10}rem`,
        height: `${height / 10}rem`,
        position: "relative",
        backgroundColor: bgColor ? "rgba(0, 0, 0, 0.1)" : "",
        borderRadius: rounded ? "100%" : "0%",
      }}
    >
      <Image
        src={`/images/${src}`}
        alt={alt}
        className={`object-cover object-center ${
          rounded ? "rounded-full" : ""
        } ${className}`}
        loading="lazy"
        placeholder="blur"
        blurDataURL={`/images/blurred/${src}`}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </div>
  );
};

const DynamicLazyBlurImage = ({
  src,
  alt,
  width,
  height,
  rounded = true,
  bgColor = true,
  className = "",
}) => {
  const [blurDataURL, setBlurDataURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchBlurData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/get-dynamic-blur-image",
          {
            method: "POST",
            body: JSON.stringify({ url: src }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const { base64 } = await response.json();
        setBlurDataURL(base64);
      } catch (error) {
        console.error("Error fetching blur image:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlurData();
  }, [src]);

  return (
    <div
      style={{
        width: `${width / 10}rem`,
        height: `${height / 10}rem`,
        position: "relative",
        backgroundColor: bgColor ? "rgba(0, 0, 0, 0.1)" : "",
        borderRadius: rounded ? "100%" : "0",
      }}
    >
      {!loading && !hasError && (
        <Image
          src={src}
          alt={alt}
          className={`object-cover object-center ${
            rounded ? "rounded-full" : ""
          } ${className}`}
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataURL}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      )}
    </div>
  );
};

export { LazyBlurImage, DynamicLazyBlurImage };
