import { useToast } from "@chakra-ui/core";
import { shareLink } from "@tennis-score/redux";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
export function ShareLink({ title, text, url }) {
  const toast = useToast();
  return "share" in window.navigator ? (
    <a
      className="d-block h5 py-2"
      onClick={() =>
        shareLink({
          title,
          text,
          url
        })
      }
    >
      Share
    </a>
  ) : (
    <CopyToClipboard
      text={`${text} - ${url}`}
      onCopy={() =>
        toast({
          title: "Link copied to clipboard",
          status: "success",
          duration: 2000,
          isClosable: true
        })
      }
    >
      <a className="d-block h5 py-2">Share</a>
    </CopyToClipboard>
  );
}
