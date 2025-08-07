"use client"

import { PFolderPrev } from "@/models/PFolder";

export type Params = {
  data: {
    foldersPrev: PFolderPrev[];
  };
};

const useHomeViewModel = ({ data }: Params) => {
  return {
    data,
  };
};

export default useHomeViewModel;
