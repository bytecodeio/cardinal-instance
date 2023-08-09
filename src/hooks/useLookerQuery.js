import { useContext } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";

export const useLookerQuery = () => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  async function getQueryBodyForSlug(slug) {
    const {
      model,
      view,
      fields,
      pivots,
      fill_fields,
      filters,
      sorts,
      limit,
      vis_config,
    } = await sdk.ok(sdk.query_for_slug(slug));
    const queryBody = {
      model,
      view,
      fields,
      pivots,
      fill_fields,
      filters,
      sorts,
      limit,
      vis_config,
    };
    return queryBody;
  }

  return { getQueryBodyForSlug };
};
