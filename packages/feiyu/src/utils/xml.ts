let xml;
export const parseXML = async (xmlStr: string) => {
  if (!xml) {
    const { XMLParser } = await import('fast-xml-parser');
    xml = new XMLParser({
      trimValues: true,
      textNodeName: '_t',
      ignoreAttributes: false,
      attributeNamePrefix: '_',
      parseAttributeValue: true,
    });
  }
  try {
    return xml.parse(xmlStr);
  } catch {
    return undefined;
  }
};
