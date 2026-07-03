document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const processBtn = document.getElementById('processBtn');
    const copyInputBtn = document.getElementById('copyInputBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const toast = document.getElementById('toast');
    const inputCount = document.getElementById('inputCount');
    const outputCount = document.getElementById('outputCount');
    const copyOutputInlineBtn = document.getElementById('copyOutputInlineBtn');

    function getQuoteType() {
        const radio = document.querySelector('input[name="quoteType"]:checked');
        return radio ? radio.value : 'single';
    }

    function hasQuotes(str, quote) {
        const trimmed = str.trim();
        return trimmed.startsWith(quote) && trimmed.endsWith(quote);
    }

    function processLine(str) {
        const quoteType = getQuoteType();
        const trimmed = str.trim();
        
        if (quoteType === 'commaOnly') {
            return trimmed;
        }
        
        const quote = quoteType === 'single' ? "'" : '"';
        
        if (hasQuotes(trimmed, quote)) {
            return trimmed;
        }
        
        return quote + trimmed + quote;
    }

    function countLines(text) {
        if (!text.trim()) return 0;
        return text.split('\n').filter(line => line.trim() !== '').length;
    }

    function updateInputCount() {
        inputCount.textContent = '行数: ' + countLines(inputText.value);
    }

    function updateOutputCount() {
        outputCount.textContent = '行数: ' + countLines(outputText.value);
    }

    function handleProcess() {
        const input = inputText.value;
        
        if (!input.trim()) {
            outputText.value = '';
            updateOutputCount();
            return;
        }

        const lines = input.split('\n').filter(line => line.trim() !== '');
        
        const processedLines = lines.map(line => processLine(line));
        
        const uniqueLines = [...new Set(processedLines)];
        
        const result = uniqueLines.map((line, index) => {
            return index < uniqueLines.length - 1 ? line + ',' : line;
        }).join('\n');
        
        outputText.value = result;
        updateOutputCount();
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    async function copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            showToast(successMessage);
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败');
        }
    }

    function handleCopyInput() {
        if (!inputText.value.trim()) {
            showToast('输入框为空');
            return;
        }
        copyToClipboard(inputText.value, '输入内容已复制');
    }

    function handleCopyOutput() {
        if (!outputText.value.trim()) {
            showToast('结果为空');
            return;
        }
        copyToClipboard(outputText.value, '结果已复制');
    }

    function handleCopyOutputInline() {
        if (!outputText.value.trim()) {
            showToast('结果为空');
            return;
        }
        const inlineText = outputText.value.replace(/\n/g, '');
        copyToClipboard(inlineText, '结果已复制(去除换行)');
    }

    processBtn.addEventListener('click', handleProcess);
    copyInputBtn.addEventListener('click', handleCopyInput);
    copyOutputBtn.addEventListener('click', handleCopyOutput);
    copyOutputInlineBtn.addEventListener('click', handleCopyOutputInline);
    inputText.addEventListener('input', updateInputCount);
});
