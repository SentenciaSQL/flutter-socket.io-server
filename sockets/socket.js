const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Linkin Park'));
bands.addBand(new Band('Evanescence'));
bands.addBand(new Band('PXNDX'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!', payload);

        io.emit('mensaje', { admin: 'Nuevo Mensaje' })
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBands(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', ( payload ) => {
    //     //io.emit('nuevo-mensaje', payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);
    // });
});