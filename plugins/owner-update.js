import { execSync} from 'child_process';

let handler = async (m, { conn, args}) => {
  try {
    await conn.reply(m.chat, '🔄 *Actualizando el bot, por favor espera...*', m);

    const output = execSync('git pull' + (args.length? ' ' + args.join(' '): '')).toString();
    const response = output.includes('Already up to date')
? '✅ *El bot ya está actualizado.*'
: `✅ *Actualización completada:*\n\n\`\`\`${output}\`\`\``;

    await conn.reply(m.chat, response, m);

} catch (error) {
    try {
      const status = execSync('git status --porcelain').toString().trim();
      if (status) {
        const conflictedFiles = status.split('\n').filter(line =>
!line.includes('ItachiSession/') &&
!line.includes('.cache/') &&
!line.includes('tmp/')
);

        if (conflictedFiles.length> 0) {
          const conflictMsg = `⚠️ *Conflictos detectados en los siguientes archivos:*\n\n` +
            conflictedFiles.map(f => '• ' + f.slice(3)).join('\n') +
            `\n\n🔧 *Solución recomendada:* reinstala el bot o resuelve los conflictos manualmente.`;

          return await conn.reply(m.chat, conflictMsg, m);
}
}
} catch (statusError) {
      console.error('Error al verificar estado de Git:', statusError);
}

    await conn.reply(m.chat, `❌ *Error al actualizar:* ${error.message || 'Error desconocido.'}`, m);
}
};

handler.help = ['update'];
handler.command = ['update', 'actualizar'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;