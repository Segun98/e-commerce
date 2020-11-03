import React from "react";
import { uploadLink } from "../../utils/client";
import Upload from "rc-upload";
import { Icon, Spinner, useToast } from "@chakra-ui/core";

interface Iprops {
  images: any[];
  setImages: any;
  imageLoad: any;
  setImageLoad: any;
}
export const ImageUpload: React.FC<Iprops> = ({
  imageLoad,
  images,
  setImages,
  setImageLoad,
}) => {
  const toast = useToast();

  //Image Upload Library
  const uploaderProps = {
    disabled: images.length === 4 ? true : false,
    action: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(uploadLink[0]);
        }, 2000);
      });
    },
    onSuccess(ImageLink) {
      setImageLoad(false);
      if (ImageLink["error"]) {
        toast({
          title: "Error Uploading Image",
          description: "Check Your Internet Connection and Try Again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setImages([...images, ImageLink]);
    },
    onProgress(step, file) {
      setImageLoad(true);
    },
    onError(err) {
      toast({
        title: "Error Uploading Image",
        description: "Check Your Internet Connection and Try Again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setImageLoad(false);
    },
  };

  return (
    <div>
      <div className="images">
        {images.map((i, index) => (
          <div key={index}>
            <img src={`${i}`} alt={`${index}`} />
            <button
              aria-label="delete image"
              onClick={() => {
                let imgs = [...images];
                let newImgs = imgs.splice(index, 1);
                setImages(newImgs);
              }}
            >
              <Icon name="delete" />
            </button>
          </div>
        ))}
      </div>
      {/* @ts-ignore */}
      <Upload {...uploaderProps} id="test">
        {imageLoad ? (
          <Spinner speed="0.7s"></Spinner>
        ) : images.length === 4 ? (
          <div>
            You Have Reached The Maximun Number of Images For This Product
          </div>
        ) : (
          <div>
            <a>
              Click or Drag Here to Upload{" "}
              {images.length === 0
                ? "Your Product's main Image"
                : "More Images"}
              . White Background Preferably
            </a>
            <img src="/upload-icon.png" />
          </div>
        )}
      </Upload>

      <style jsx>{`
        .images {
          display: flex;
        }

        .images button {
          cursor:pointer
        }

        .images img{
          border 1px solid var(--softgrey);
          height: 70px;
          width: 70px;
          margin: 0 3px
        }
      `}</style>
    </div>
  );
};
