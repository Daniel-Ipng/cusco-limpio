import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuariosService {

  // @InjectRepository inyecta el repositorio de TypeORM
  // Es el objeto que usamos para hacer queries a la tabla usuarios
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(dto: CrearUsuarioDto): Promise<Omit<Usuario, 'passwordHash'>> {
    // Verificar que el email no esté registrado
    const existe = await this.usuarioRepo.findOne({
      where: { email: dto.email },
    });
    if (existe) throw new ConflictException('El email ya está registrado');

    // Encriptar contraseña con bcrypt (10 salts = balance seguridad/velocidad)
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = this.usuarioRepo.create({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
      rol: dto.rol ?? 'ciudadano',
    });

    const guardado = await this.usuarioRepo.save(usuario);

    // Nunca devolvemos el hash en la respuesta
    const { passwordHash: _, ...resultado } = guardado;
    return resultado;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { id },
      relations: {zona: true},
    });
  }

  async listarTodos(): Promise<Omit<Usuario, 'passwordHash'>[]> {
    const usuarios = await this.usuarioRepo.find({ relations: { zona: true } });
    return usuarios.map(({ passwordHash: _, ...u }) => u);
  }

  async eliminar(id: string): Promise<void> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    await this.usuarioRepo.remove(usuario);
  }
}