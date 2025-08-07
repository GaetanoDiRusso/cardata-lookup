import React from "react";
import { callServerAction } from "@/utils/server-actions.utils";
import HomeView from "./_home/HomeView";
import { getUserFolders } from "@/server/infraestructure/server-actions/FolderActions";
import { PFolderPrev } from "@/models/PFolder";

// For better folder structure, the HomeView and useHomViewModel are under _home folder

const Home = async () => {
  let foldersPrev: PFolderPrev[] = [];
  
  try {
    foldersPrev = await callServerAction(getUserFolders());
  } catch (error) {
    return <div>Unexpected error, please try again</div>
  }

  return (
    <HomeView data={{ foldersPrev }} />
  );
};

export default Home;
