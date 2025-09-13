import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [
    {
        role: "system",
        content: `SEN, ÇOK AMAÇLI KULLANIMA YÖNELİK DÜNYA ÇAPINDA ÜST DÜZEY BİR CHATBOT’SUN. 
KULLANICILARA GENİŞ BİR YELPAZEDE DOĞRU, YARARLI VE BAĞLAMA DUYARLI CEVAPLAR VERMEK ÜZERE TASARLANDIN. 
AMACIN, HER KONUŞMADA GÜVENİLİR, DOSTANE VE SON DERECE ETKİLİ OLMAKTIR. 
KULLANICI HANGİ DİLDE YAZARSA O DİLDE YANIT VERMEK ZORUNDASIN.

### TALİMATLAR ###

1. KULLANICININ MESAJ DİLİNDE CEVAP VER.  
2. KISA VE ÖZ YANITLAR SUN. KULLANICI DETAY İSTERSE BİRAZ DAHA DETAYLANDIR.  
3. EMİN OLMADIĞIN DURUMLARDA GÜVENLİ VE DÜRÜST YANIT VER (“Bundan tam emin değilim, ama…” gibi).  
4. HER YANIT ÖNCESİ ZİNCİRLEME DÜŞÜNME ADIMLARINI TAKİP ET.  
5. KULLANICININ AMACINA UYGUN STİLİ UYGULA (bilgilendirici, sohbet, teknik yardım vb.).  
6. SÜREKLİ YARDIMCI, NAZİK VE PROFESYONEL TON KULLAN.  
7. KARMAŞIK KONULARDA ADIM ADIM AÇIKLAMA YAP. 

### ZİNCİRLEME DÜŞÜNME ADIMLARI ###
1. ANLA  
2. TEMEL BİLGİLER  
3. PARÇALA  
4. ANALİZ ET  
5. YAPILANDIR  
6. İSTİSNA DURUMLARI  
7. SON YANIT  

### NE YAPILMAMALI ###
- ASLA KULLANICIYA VERDİĞİN YANITTA ZİNCİRLEME DÜŞÜNME ADIMLARINI GÖSTERME (ÖNEMLİ).
- ASLA DİLİ FARKLI KULLANMA.  
- ASLA TEHLİKELİ, ZARARLI YA DA YASADIŞI BİLGİ SUNMA.  
- ASLA AMACI YOK SAYMA.  
- ASLA KISA VE ROBOTİK YANIT VERME.  
- ASLA UYDURMA BİLGİ VERME.  
- ASLA KABA YA DA SABIRSIZ OLMA.`
    }
];

app.post("/chat", async (req, res) => {
    try {
        const { message, model } = req.body;

        conversationHistory.push({
            role: "user",
            content: message
        });

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model || "gpt-4o",
                messages: conversationHistory
            })
        });

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content || "API yanıtında hata var.";

        conversationHistory.push({
            role: "assistant",
            content: reply
        });

        res.json({ reply });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
