// metacritic.js
export async function getLatestGames() {
  try {
    const url = "https://www.metacritic.com/browse/games/score/metascore/all/all/filtered";
    
    // Usamos un proxy CORS para evitar problemas (solo desarrollo)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    // Si usamos proxy, el contenido está en data.contents
    const html = data.contents || data;
    
    // Parseamos el HTML para extraer los datos
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const games = [];
    
    // Seleccionamos todos los elementos de juego
    const gameElements = doc.querySelectorAll('.clamp-list tr');
    
    gameElements.forEach((element) => {
      try {
        const title = element.querySelector('.title h3')?.textContent?.trim();
        const score = element.querySelector('.metascore_w')?.textContent?.trim();
        const imageUrl = element.querySelector('img')?.src;
        const gameUrl = element.querySelector('a.title')?.href;
        
        if (title && score && imageUrl) {
          games.push({
            title,
            score,
            image: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
            url: gameUrl,
            slug: gameUrl?.split('/').pop() || Math.random().toString(36).substring(2, 9)
          });
        }
      } catch (error) {
        console.error("Error parsing game element:", error);
      }
    });
    
    return games.slice(0, 10); // Limitamos a 10 resultados
  } catch (error) {
    console.error("Error fetching Metacritic data:", error);
    throw new Error("Failed to fetch games from Metacritic");
  }
}

export async function getGameDetails(slug) {
  try {
    const url = `https://www.metacritic.com/game/${slug}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const html = data.contents || data;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extraer detalles principales
    const title = doc.querySelector('.product_title h1')?.textContent?.trim();
    const description = doc.querySelector('.product_summary .data span span')?.textContent?.trim();
    const score = doc.querySelector('.metascore_w span')?.textContent?.trim();
    const image = doc.querySelector('.product_image img')?.src;
    
    // Extraer críticas
    const reviews = [];
    const reviewElements = doc.querySelectorAll('.review_content');
    
    reviewElements.forEach((review) => {
      const source = review.querySelector('.source')?.textContent?.trim();
      const score = review.querySelector('.metascore_w')?.textContent?.trim();
      const text = review.querySelector('.review_body')?.textContent?.trim();
      
      if (source && text) {
        reviews.push({
          source,
          score: score || "N/A",
          text
        });
      }
    });
    
    return {
      title: title || "No title available",
      description: description || "No description available",
      score: score || "N/A",
      image: image?.startsWith('//') ? `https:${image}` : image || "",
      reviews,
      slug
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw new Error(`Failed to fetch details for game: ${slug}`);
  }
}