import { buscarVideoCliente } from "./firebase-config.js";

// Espera até que o A-Frame esteja pronto e carregado
window.addEventListener('load', () => {
    
    // Todo o código de registro do componente deve estar aqui dentro!
    AFRAME.registerComponent('cliente-ar', {
        // Define as propriedades (schema) que podem ser passadas para o componente
        schema: {
            nomeCliente: { type: 'string' },
            videoId: { type: 'string' }
        },

        // A-Frame: init é chamado quando o componente é inicializado
        init: function () {
            const data = this.data; // Propriedades: nomeCliente, videoId
            const targetEl = this.el; // A entidade <a-entity mindar-image-target>
            const statusEl = document.getElementById("status");

            let videoEl = document.getElementById(data.videoId);
            let videoLoaded = false;
            
            statusEl.textContent = `Carregando vídeo para ${data.nomeCliente}...`;

            // 1. Busca a URL do vídeo no Firebase e configura o elemento <video>
            buscarVideoCliente(data.nomeCliente)
                .then((dados) => {
                    const urlVideo = dados.videourl;
                    console.log(`🎬 URL do vídeo de ${data.nomeCliente}:`, urlVideo);

                    if (urlVideo) {
                        videoEl.src = urlVideo;
                        videoLoaded = true;
                        // Adiciona o plano (plane) que irá exibir o vídeo, uma vez que temos a URL
                        this.adicionarVideoPlane();
                        statusEl.textContent = "Pronto. Aponte a câmera para a imagem.";
                    } else {
                        statusEl.textContent = `Erro: URL do vídeo de ${data.nomeCliente} não encontrada no Firestore.`;
                    }
                })
                .catch((err) => {
                    console.error(`Erro ao buscar ${data.nomeCliente} no Firebase:`, err);
                    statusEl.textContent = `Erro ao carregar cliente: ${err.message}`;
                });


            // 2. Controla a reprodução do vídeo com base no rastreamento do MindAR
            targetEl.addEventListener('targetFound', () => {
                console.log(`🎯 Imagem de ${data.nomeCliente} rastreada!`);
                if (videoLoaded) {
                    // Tenta tocar o vídeo (precisa ser silencioso/mutado para autoplay)
                    videoEl.play().catch(e => console.error("Erro ao tentar tocar o vídeo:", e));
                }
            });

            targetEl.addEventListener('targetLost', () => {
                console.log(`❌ Imagem de ${data.nomeCliente} perdida.`);
                if (videoLoaded) {
                    videoEl.pause();
                }
            });
        },

        // Função para criar e anexar o plano de vídeo à entidade alvo
        adicionarVideoPlane: function() {
            const data = this.data;
            const targetEl = this.el;
            const videoEl = document.getElementById(data.videoId);

            // Cria a entidade <a-plane>
            const videoPlane = document.createElement('a-plane');
            
            // Define os atributos do plano
            videoPlane.setAttribute('src', `#${data.videoId}`);
            videoPlane.setAttribute('height', '1.0');
            videoPlane.setAttribute('width', '1.777'); // Proporção 16:9
            videoPlane.setAttribute('rotation', '0 0 0');
            videoPlane.setAttribute('position', '0 0 0.05');
            videoPlane.setAttribute('material', 'shader: flat; transparent: true; opacity: 1;');

            // Anexa o plano à entidade do rastreador (targetEl)
            targetEl.appendChild(videoPlane);
            console.log(`✅ Plano de vídeo para ${data.nomeCliente} adicionado.`);
        }
    });
}); // Fim do listener 'load'