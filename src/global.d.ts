interface NavigatorUAData {
    brands: {
        brand: string,
        version: string
    }[]
    mobile: boolean,
    platform: string
}

interface BraveInterface {
    isBrave: () => Promise<boolean>;
}
  
declare global {
    interface Navigator {
        brave?: BraveInterface;
        userAgentData?: NavigatorUAData;
    }
}
  
export {};