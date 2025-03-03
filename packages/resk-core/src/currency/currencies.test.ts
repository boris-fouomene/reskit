import "reflect-metadata"
import Currency from "./index";
import session from "./session";
import { ICurrency } from "./types";
import "../translations";
import { i18n } from "@/i18n";

describe("Currency Utils", () => {
  beforeEach(() => {
    /* session.setCurrency({
        format: "%v",
        symbol: "$",
        decimalDigits: 2,
        decimalSeparator: ".",
        thousandSeparator: ","
      }); */
  });

  describe("prepareOptions", () => {
    it("should return default currency when no options provided", () => {
      expect(Currency.prepareOptions()).toEqual(session.getCurrency());
    });

    it("should merge options with default currency", () => {
      const customOptions = { format: "$%v", decimalDigits: 3 };
      expect(Currency.prepareOptions(customOptions as ICurrency)).toMatchObject(customOptions);
    });
  });


  describe("unformat", () => {
    it("should return number for valid input", () => {
      expect(Currency.unformat("$1,234.56", ".")).toBe(1234.56);
    });
    it("should return 0 for invalid input", () => {
      expect(Currency.unformat("invalid", ".")).toBe(0);
    });
  });

  describe("toFixed", () => {
    it("should round to correct decimal places", () => {
      expect(Currency.toFixed(1.235, 2)).toBe("1.24");
    });
  });

  describe("formatNumber", () => {
    it("should format number correctly", () => {
      expect(Currency.formatNumber(1234567.89, { decimalDigits: 2, thousandSeparator: ",", decimalSeparator: "." })).toBe("1,234,567.89");
    });
  });
  
  describe("format", () => {
    it("should format number correctly", () => {
      expect(Currency.formatNumber(1234567.89)).toBe("1,234,567.89");
    });
  });
  
  describe("Fromat with internalized currency", () => {
    beforeAll(async ()=>{
        i18n.registerTranslations({
            "fr" : {
                "currencies" : {
                    thousandSeparator: " ",
                    decimalSeparator: ".",
                    decimalDigits: 2,
                }
            }
        })
        await i18n.setLocale("fr");
    })
    it("Should format number in frensh",()=>{
        expect(Currency.session.getCurrency()).toMatchObject({
            decimalDigits: 2,
            decimalSeparator: ".",
            thousandSeparator: " "
        });
        expect(Currency.formatNumber(1234567.89)).toBe("1 234 567.89");
        expect(Currency.formatMoney(1234567.89)).toBe("1 234 567.89 FCFA");
    })
  });
});
