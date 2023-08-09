import React, { useCallback, useContext } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";

const Explore = styled.div`
  width: 100%;
  min-height: unset;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmbedTable = ({ queryId }) => {
  const { extensionSDK } = useContext(ExtensionContext);

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionSDK.lookerHostData.hostUrl;

      if (el && hostUrl && queryId) {
        el.innerHTML = "";
        LookerEmbedSDK.init(hostUrl);
        LookerEmbedSDK.createExploreWithUrl(
          `${hostUrl}/embed/query/order_express/time_detail_cv?qid=${queryId}&sdk=2&embed_domain=${hostUrl}&sandboxed_host=true`
        )
          .appendTo(el)
          .build()
          .connect()

          .catch((error) => {
            console.error("Connection error", error);
          });
      }
    },
    [queryId]
  );

  return (
    <Wrapper>{queryId ? <Explore ref={embedCtrRef} /> : <Spinner />}</Wrapper>
  );
};

export default EmbedTable;
