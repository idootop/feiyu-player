import { kIsLinux, kIsMac, kIsWindows } from "../utils/os";
import { Button } from "./Button";
import { IconMac } from "./Icons/IconMac";
import { IconLinux } from "./Icons/IconLinux";
import { IconWindows } from "./Icons/IconWindows";
import { IconGithub } from "./Icons/IconGithub";

const kReleasePage = "https://github.com/idootop/feiyu-player/releases";
const kDownloadPath = kReleasePage + "/download/latest/";

export function Download() {
  const Icon = kIsMac
    ? IconMac
    : kIsWindows
    ? IconWindows
    : kIsLinux
    ? IconLinux
    : IconGithub;

  const download = kIsMac
    ? "feiyu_macos_universal.dmg"
    : kIsWindows
    ? "feiyu_windows_x86_64.exe"
    : kIsLinux
    ? "feiyu_linux_x86_64.deb"
    : false;

  return (
    <Button
      url={download ? kDownloadPath + download : kReleasePage}
      download={download}
    >
      <Icon />
      下载
    </Button>
  );
}
