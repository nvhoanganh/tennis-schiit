import React from "react";
import { shareLink, isInstalled } from "@tennis-score/redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "@chakra-ui/core";
export function ShareLink({ title, text, url }) {
  const toast = useToast();
  return isInstalled() ? (
    <a
      className="d-block h5 py-2"
      onClick={() =>
        shareLink({
          title,
          text,
          url: `https://tennisscoresheet.com${url}`
        })
      }
    >
      Share
    </a>
  ) : (
    <CopyToClipboard
      text={`${text} - https://tennisscoresheet.com${url}`}
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
