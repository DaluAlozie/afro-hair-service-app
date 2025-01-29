// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAddressPart = (type: string, addressComponents: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = addressComponents.find((c: { types: string | any[]; }) => c.types.includes(type));
    if (component) {
        return component.longText;
    }
    return '';
};

export { getAddressPart };