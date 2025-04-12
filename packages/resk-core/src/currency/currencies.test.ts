import "reflect-metadata"
import Currency from "./index";
import session from "./session";
import "../utils/numbers";
import { ICurrency } from "./types";
import "../translations";
import { _abreviateNumber, abreviateNumber, IAbreviateNumberResult } from "../utils/numbers";
import i18n from "@/i18n";

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
    beforeAll(async () => {
      i18n.registerTranslations({
        "fr": {
          "currencies": {
            thousandSeparator: " ",
            decimalSeparator: ".",
            decimalDigits: 2,
          }
        }
      })
      await i18n.setLocale("fr");
    })
    it("Should format number in frensh", () => {
      expect(Currency.session.getCurrency()).toMatchObject({
        decimalDigits: 2,
        decimalSeparator: ".",
        thousandSeparator: " "
      });
      expect(Currency.formatNumber(1234567.89)).toBe("1 234 567.89");
      expect(Currency.formatMoney(1234567.89)).toBe("1 234 567.89 FCFA");
    })
  });

  describe("Should abreviate and format", () => {
    it("test of abreviate and format number", () => {
      expect((124300).abreviate2FormatXAF(2)).toBe("124.30K FCFA");
    });
  })
});


describe('_abreviateNumber formatting options', () => {
  test('should format using decimalDigits option', () => {
    // Using exactly 3 decimal places
    expect(abreviateNumber(1500, 3)).toBe("1.500K");
    expect(abreviateNumber(1500, 0)).toBe("2K");
    expect(abreviateNumber(1234, 2)).toBe("1.23K");
  });

  test('should use thousandsSeparator option', () => {
    expect(abreviateNumber(1234567, undefined, ',')).toBe("1.23457M");
    expect(abreviateNumber(1234567, 3, ',', '')).toBe("1.235M");
    expect(abreviateNumber(9876543210, undefined, ' ')).toBe("9.87654B");
  });

  test('should use decimalSeparator option', () => {
    expect(abreviateNumber(1234.56, undefined, undefined, ',')).toBe("1,23456K");
    expect(abreviateNumber(1500, undefined, undefined, ',')).toBe("1,5K");
    expect(abreviateNumber(1234567, 2, '.', ',')).toBe("1,23M");
  });

  test('should work with returnObject and formatting options', () => {
    const result = _abreviateNumber(1500, 3, ',', '.') as IAbreviateNumberResult;

    expect(result.result).toBe("1.500K");
    expect(result.formattedValue).toBe("1.500");
    expect(result.minAbreviationDecimalDigits).toBe(1);
  });

  test('should allow direct options object without returnObject parameter', () => {
    expect(abreviateNumber(1500, 3, ',', '.')).toBe("1.500K");
  });

  test('should preserve original behavior when no options provided', () => {
    expect(abreviateNumber(1500)).toBe("1.5K");
    expect(abreviateNumber(1000)).toBe("1K");

    const result = _abreviateNumber(1234);
    expect(result.result).toBe("1.234K");
    expect(result.minAbreviationDecimalDigits).toBe(3);
  });
});