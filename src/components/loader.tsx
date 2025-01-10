import LoadingIcon from "#/img/spr_savepoint.gif"
import Image from "next-export-optimize-images/image";

export default function Loader() {
    return <div className="flex flex-col text-3xl h-full w-full justify-center place-items-center">
        <Image height={100} width={100} alt="Loading..." src={LoadingIcon} className="pixelated" />
        <span>Loading...</span>
    </div>
}