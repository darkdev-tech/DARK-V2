const {zokou}=require("../framework/zokou")







zokou({nomCom:"reboot",categorie:"Mods",reaction:"👨🏿‍💼"},async(dest,z,com)=>{


  
const{repondre,ms,dev,superUser}=com;

  if(!superUser)
  {
    return repondre("This command is for owner only");
  }

  const {exec}=require("child_process")

    repondre("*𝑫𝑨𝑹𝑲 𝑴𝑫 𝑽2 𝑹𝑬𝑺𝑻𝑨𝑹𝑻𝑰𝑵𝑮...*");

  exec("pm2 restart all");
  

  



})
