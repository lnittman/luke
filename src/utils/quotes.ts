interface Quote {
  text: string;
  author: string;
  source?: string;
  year?: string;
}

interface QuoteMap {
  [key: string]: Quote[];
}

export const defaultQuote: Quote = {
  text: "now his dream was a dream of shadows\ngathering like storm clouds",
  author: "roberto bolaño",
  source: "2666",
  year: "2004"
};

export const techQuotes: QuoteMap = {
  books: [{
    text: "now his dream was a dream of shadows\ngathering like storm clouds",
    author: "roberto bolaño",
    source: "2666",
    year: "2004"
  }],
  product: [{
    text: "the best products come from people who want to solve\ntheir own, real problems",
    author: "drew houston",
    year: "2012"
  }],
  engineering: [{
    text: "the most profound technologies are those\nthat disappear",
    author: "mark weiser",
    year: "1991"
  }],
  design: [{
    text: "the details are not the details.\nthey make the design",
    author: "charles eames",
    year: "1956"
  }],
  ux: [{
    text: "good design is as little design as possible",
    author: "dieter rams",
    year: "1976"
  }],
  ai: [{
    text: "the question of whether a computer can think is no more interesting\nthan the question of whether a submarine can swim",
    author: "edsger dijkstra",
    year: "1984"
  }],
  audio: [{
    text: "music is just a series of changes that take place\nin time and space",
    author: "j dilla",
    year: "2003"
  }],
  vim: [{
    text: "perfection is achieved not when there is nothing more to add,\nbut when there is nothing left to take away",
    author: "antoine de saint-exupéry",
    year: "1939"
  }]
}; 